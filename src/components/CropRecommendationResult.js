import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import Papa from 'papaparse'; // Library for parsing CSV files

function CropRecommendationResult({ formValues }) {
    const [trainedModel, setTrainedModel] = useState(null);
    const [cropLabels, setCropLabels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendedCrop, setRecommendedCrop] = useState('');

    useEffect(() => {
        const loadAndTrainModel = async () => {
            try {
                // Load and parse the CSV file containing the dataset
                const response = await fetch('/Crop_recommendation.csv');
                const csvData = await response.text();
                const parsedData = Papa.parse(csvData, { header: true });

                // Extract crop labels
                const crops = parsedData.data.map(row => row.Crop);
                const uniqueCrops = [...new Set(crops)];

                if (uniqueCrops.length < 2) {
                    setError('Dataset does not contain enough unique classes for classification.');
                    setLoading(false);
                    return;
                }

                // Convert CSV data to numerical labels
                const inputData = parsedData.data.map(row => [
                    parseFloat(row.Nitrogen),
                    parseFloat(row.Potassium),
                    parseFloat(row.Phosphorus),
                    parseFloat(row.pH)
                ]);

                // Prepare training data
                const xs = tf.tensor2d(inputData, [inputData.length, 4]);

                // Convert crop labels to indices
                const cropIndices = crops.map(crop => uniqueCrops.indexOf(crop));
                const cropIndicesTensor = tf.tensor1d(cropIndices, 'int32');

                // One-hot encode crop labels
                const cropOneHot = tf.oneHot(cropIndicesTensor, uniqueCrops.length);

                // Define the model architecture
                const model = tf.sequential();
                model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [4] }));
                model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
                model.add(tf.layers.dense({ units: uniqueCrops.length, activation: 'softmax' }));

                // Compile the model
                model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

                // Train the model
                await model.fit(xs, cropOneHot, { epochs: 100 });

                // Set the trained model and crop labels
                setTrainedModel(model);
                setCropLabels(uniqueCrops);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        loadAndTrainModel();
    }, []);

    const handlePrediction = async () => {
        if (!trainedModel) return; // Model not loaded yet

        const { Nitrogen, Potassium, Phosphorus, pH } = formValues;

        // Make prediction
        const inputData = tf.tensor2d([[parseFloat(Nitrogen), parseFloat(Potassium), parseFloat(Phosphorus), parseFloat(pH)]]);
        const prediction = trainedModel.predict(inputData);
        const predictedCropIndex = prediction.argMax(1).dataSync()[0];
        const predictedCrop = cropLabels[predictedCropIndex];
        setRecommendedCrop(predictedCrop);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <button onClick={handlePrediction}>Predict Crop</button>
            {recommendedCrop && <p>Recommended Crop: {recommendedCrop}</p>}
        </div>
    );
}

export default CropRecommendationResult;
