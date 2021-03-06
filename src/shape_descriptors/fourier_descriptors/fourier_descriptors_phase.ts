// fourier_descriptors_phase.ts
/**
 *
 * Includes code for Phase Fourier Descriptors
 * See 2016 W. Burger Digital Image Processing An Algorithmic Introduction - p. 665 for detailed describtion.
 */
import * as tf from '@tensorflow/tfjs';
import { Point, subtractPoints, toArray } from '../../image_processing/blob_analysis/point';
import { fp, getDescriptorHarmonics } from './utils';


 /**
 * Compute the Fourier Descriptor of a polygon.
 * Implements Kuhl and Giardina method of computing the coefficients
 * for a specified number of harmonics. See the original paper for more detail:
 * Kuhl, FP and Giardina, CR (1982). Elliptic Fourier features of a closed
 * contour. Computer graphics and image processing, 18(3), 236-258.
 * Or see W. Burger Digital Image Processing An Algorithmic Introduction - p. 682
 * @param {Point[]} contour - Array with x and y coordinates of contour line
 * @param {number} harmonics -  The number of harmonics to compute for the given shape
 * @returns {tf.Tensor} complex valued Fourier descriptors
 */
export const makeFourierDescriptorFromPolygon = (contour: Point[], harmonics: number = 40): tf.Tensor => {

    const new_vector_length = 2 * harmonics + 1;
    const N = contour.length;
    const FD_real = Array(new_vector_length).fill(0);
    const FD_complex = Array(new_vector_length).fill(0);

    const dxy : number[][] = [];
    for(let i = 0; i < N; i++)
        dxy.push(toArray(subtractPoints(contour[(i + 1) % N], contour[i])));
    
    const dt = tf.sqrt(tf.pow( tf.tensor2d(dxy) ,2).sum(1)).dataSync() as Float32Array;
    const t = tf.concat([tf.tensor1d([0]), tf.cumsum(dt)]).dataSync() as Float32Array;
    const T = t[t.length - 1];


   //compute coefficient G(0)
   let a0 = 0, c0 = 0;
   for(let i = 0; i < contour.length; i++){
        const s = (t[i + 1] ** 2 - t[i] ** 2) / (2 * dt[i]) - t[i];
        a0 += s * dxy[i][0] + dt[i] * (contour[i].x - contour[0].x);
        c0 += s * dxy[i][1] + dt[i] * (contour[i].y - contour[0].y);
   }
   FD_real[0] = contour[0].x + Math.pow(T,-1) * a0;
   FD_complex[0] = contour[0].y + Math.pow(T, -1) * c0;

   
   //compute the remaining coefficients
   for(let m = 1; m < harmonics + 1; m++ ){
       const omega0 = t.slice(0,t.length - 1).map(value => (2 * Math.PI * m ) / T * value);
       const omega1 = t.slice(0,t.length - 1).map((_, i) => (2 * Math.PI * m ) / T * t[(i + 1) % N]);

       const a_m = getTrigometricCoefficient(omega0, omega1, dt, dxy, 'a_m');
       const c_m = getTrigometricCoefficient(omega0, omega1, dt, dxy, 'c_m');
       const b_m = getTrigometricCoefficient(omega0, omega1, dt, dxy, 'b_m');
       const d_m = getTrigometricCoefficient(omega0, omega1, dt, dxy, 'd_m');
       const constant = T / (2 * Math.PI * m) ** 2;

       FD_real[m] = constant * (a_m + d_m);
       FD_complex[m] = constant * (c_m - b_m);
       FD_real[new_vector_length - m] = constant * (a_m - d_m);
       FD_complex[new_vector_length - m] = constant * (c_m + b_m);

    }

    return tf.complex(FD_real, FD_complex);
};


/**
 * Normalizes Fourier Descriptor and concatenates imaginary and real values 
 * of phase shifted descriptors G_a and G_b
 * @param {tf.Tensor} descriptor - Unnormalized Fourier Descriptor
 */
export const normalizeFourierDescriptor = (descriptor: tf.Tensor ): tf.Tensor => {

    const transDescriptor = setDescriptorTranslationInvariant(descriptor);
    const scaleDescriptor = setDescriptorScaleInvariant(transDescriptor);
    const [G_a, G_b] = setDescriptorStartPointInvariant(scaleDescriptor);

    return tf.concat([tf.real(G_a), tf.imag(G_a), tf.real(G_b), tf.imag(G_b)]);
};


const getTrigometricCoefficient = (
        omega0: Float32Array,
        omega1: Float32Array,
        dt: Float32Array,
        dxy: number[][],
        coefficient: 'a_m' | 'b_m' | 'c_m' | 'd_m'): number => {
    
    const axis_i = coefficient === 'a_m' || coefficient === 'b_m' ? 0 : 1;
    const denominator = tf.tensor1d(dt.map((value, index) => value * dxy[index][axis_i]));
    let numerator: tf.Tensor;

    if (coefficient === 'a_m' || coefficient === 'c_m'){
        numerator = tf.sub( tf.cos(tf.tensor1d(omega1)),tf.cos(tf.tensor1d(omega0)));

    } else {
        numerator = tf.sub( tf.sin(tf.tensor1d(omega1)),tf.sin(tf.tensor1d(omega0)));
    }
    const div = tf.divNoNan(numerator, denominator);
    const sum = div.sum();
    return sum.dataSync()[0];
};

export const setDescriptorTranslationInvariant = (descriptor: tf.Tensor): tf.Tensor => {

    const maskArray = Array(descriptor.shape[0]).fill(1).map((val,i) => i !== 0 ? val : 0);
    return tf.mul(descriptor, tf.tensor1d(maskArray));
};


export const setDescriptorScaleInvariant = (descriptor: tf.Tensor): tf.Tensor => {

    const harmonics = getDescriptorHarmonics(descriptor);
    const s = tf.add(tf.abs(descriptor).slice(1, harmonics), tf.abs(descriptor).slice(harmonics + 1, -1)).sum();
    const v = tf.divNoNan(1,tf.sqrt(s)).arraySync();
    return tf.mul(descriptor, tf.tensor1d(Array(descriptor.shape[0]).fill(v)));
};


/**
 * Makes the Fourier descriptor invariant to start point phase phi and phi + Math.PI
 * @param {tf.Tensor} - Fourier Descriptor
 * @returns {tf.Tensor} descriptor shifted by phi and phi + PI
 */
export const setDescriptorStartPointInvariant = (descriptor: tf.Tensor): [tf.Tensor, tf.Tensor] => {

    const phi = getStartPointPhase(descriptor);
    const G_a = shiftDescriptorStartPointPhase(descriptor, phi);
    const G_b = shiftDescriptorStartPointPhase(descriptor, phi + Math.PI);
    return [G_a, G_b];
};


/**
 * Normalizes discriptor by shifting start point phase
 * @param {tf.Tensor} descriptor - Fourier descriptor
 * @param {number} phi - start point phase
 * @returns {tf.Tensor} - Normalized Fourier descriptor
 */
export const shiftDescriptorStartPointPhase = (descriptor: tf.Tensor, phi: number): tf.Tensor => {
    const mulArrayReal = [0];
    const mulArrayImag = [0];
    for(let m = 1; m < descriptor.shape[0]; m++){
        if(m < getDescriptorHarmonics(descriptor) + 1){
            const phiM = m * phi;
            mulArrayReal.push(Math.cos(phiM));
            mulArrayImag.push(Math.sin(phiM));
        } else {
            const phiM = (descriptor.shape[0] - m) * phi;
            mulArrayReal.push(Math.cos(phiM));
            mulArrayImag.push(Math.sin(-phiM));
        }
    }
    const mulTensor = tf.complex(mulArrayReal, mulArrayImag);
    return tf.mul(descriptor, mulTensor);

};


 /**
 * Returns start point phase phi by maximizing function _fp(descriptor,phi), with phi [0,np.pi)
 * The maximum is simple brute-force search (OPTIMIZE!!)
 * @param {tf.Tensor} descriptor - Fourier descriptor
 * @returns {number} Start point phase
 */
export const getStartPointPhase = (descriptor: tf.Tensor): number => {

    const K = 400; //brute force with 400 steps TO DO: OPTIMIZE!!
    const rangeArray = Array(K).fill(0);
    const phis = rangeArray.map((_, i) => {
        const phi = (Math.PI * i) / K;
        return {
            phi: phi,
            c: fp(descriptor, phi)
        };
    });
    return phis.reduce((prev,curent) => curent.c > prev.c ? curent : prev).phi;
};