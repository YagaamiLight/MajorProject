// CropRecommendationForm.js
import React, { useState } from 'react';
import './CropRecommendationForm.css'; // Import CSS file for styling
import CropRecommendationResult from './CropRecommendationResult';

function CropRecommendationForm() {
    const [formValues, setFormValues] = useState({
        nitrogen: '',
        potassium: '',
        phosphorus: '',
        ph: ''
    });

    const [showResult, setShowResult] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setShowResult(true);
    }

    return (
        <div className="crop-form-container">
            <h2 className="form-heading">Crop Recommendation System</h2>
            <form onSubmit={handleSubmit} className="crop-form">
                <div className="form-group">
                    <label htmlFor="nitrogen" className="label">Nitrogen:</label>
                    <input
                        type="text"
                        id="nitrogen"
                        name="nitrogen"
                        value={formValues.nitrogen}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="potassium" className="label">Potassium:</label>
                    <input
                        type="text"
                        id="potassium"
                        name="potassium"
                        value={formValues.potassium}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phosphorus" className="label">Phosphorus:</label>
                    <input
                        type="text"
                        id="phosphorus"
                        name="phosphorus"
                        value={formValues.phosphorus}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ph" className="label">Soil pH:</label>
                    <input
                        type="text"
                        id="ph"
                        name="ph"
                        value={formValues.ph}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-button">Recommend Crop</button>
            </form>
            {showResult && <CropRecommendationResult formValues={formValues} />}
        </div>
    );
}

export default CropRecommendationForm;
