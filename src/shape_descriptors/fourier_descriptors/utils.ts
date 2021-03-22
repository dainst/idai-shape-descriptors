import * as tf from '@tensorflow/tfjs';


export const getElementFromComplexTensor = (tensor: tf.Tensor, index: number): tf.Tensor =>
    tf.complex((tf.real(tensor).arraySync() as number[])[index],
                (tf.imag(tensor).arraySync() as number[])[index]);

                
export const getDescriptorHarmonics = (descriptor: tf.Tensor): number => (descriptor.shape[0] - 1) / 2;


/**
 * Look for quantity that depends only on the phase differneces within the Fourier descriptor pairs
 * @param {tf.Tensor} descriptor - Fourier descriptor
 */
export const fp = (descriptor: tf.Tensor, phi: number): number => {

    let s = 0;
    for(let m = 1; m < getDescriptorHarmonics(descriptor) + 1; m++){
        const phiM = m * phi;
        const z1 = tf.mul(getElementFromComplexTensor(descriptor, descriptor.shape[0] - m),
                    tf.complex(tf.cos(phiM), tf.sin(-phiM)));
        const z2 = tf.mul(getElementFromComplexTensor(descriptor, m),
                    tf.complex(tf.cos(phiM), tf.sin(phiM)));
        s += tf.sub(
                tf.mul(tf.real(z1), tf.imag(z2)),
                tf.mul(tf.imag(z1), tf.real(z2))).arraySync() as number;
    }
    return s;
};