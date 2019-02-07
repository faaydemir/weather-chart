/**
 * 
 */
class Sampler {
    constructor() {

    }

    static minMaxSampler(getter) {
        return array => {
            let minIndex, maxIndex;


            for (let i = 0; i < array.length; i++) {
                if (i === 0) {
                    minIndex = 0;
                    maxIndex = 0;
                }
                if (getter(array[i]) > getter(array[maxIndex])) {
                    maxIndex = i;
                }
                if (getter(array[i]) < getter(array[minIndex])) {
                    minIndex = i;
                }
            }
            if (minIndex === maxIndex) {
                return [array[minIndex]];
            } else {
                return (minIndex >maxIndex)?[array[maxIndex], array[minIndex]]:[array[minIndex], array[maxIndex]]
                ;
            }
        };
    }


    /**
     * @param  {Array} originalData data to take samples
     * @param  {Number} sampleLength sample data length
     * @param  {Function} sampleFunction  function to take sample 
     * @param {Number} sampleFunctionReturnLength length that sample function return
     */
    static sampleTo(originalData, sampleLength, sampleFunction, sampleFunctionReturnLength = 1) {

            if (originalData == null || originalData.length === 0)
                return null;

            let sampleArray = [];

            let subArrayLength = Math.floor(originalData.length / (sampleLength / sampleFunctionReturnLength))

            const slicedArrays = this._sliceArray(originalData, subArrayLength);

            slicedArrays.forEach(slicedArray => {
               sampleArray =  sampleArray.concat(sampleFunction(slicedArray));
            });


            return sampleArray;



        }
        /**
         * @param  {Array} array array to slice
         * @param  {Number} sliceLength sliced array length
         */
    static _sliceArray(array, sliceLength) {
        const length = array.length;
        const slicedArray = [];
        for (let i = 0; i <= length; i += sliceLength) {
            slicedArray.push(array.slice(i, i + sliceLength));
            // do whatever
        }
        return slicedArray;
    }
}