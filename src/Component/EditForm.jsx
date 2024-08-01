import axios from "axios";
import React, { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

const EditForm = () => {
  
  //all state changes
  const [formData, setFormData] = useState({
    pan: "",
    namefull: "",
    email: "",
    mobile: "",
    addresses: [
      { addressLine1: "", addressLine2: "", postcode: "", state: "", city: "" },
    ],
  });
  const { id } = useParams();
  const navigate = useNavigate();

  //get this all localStorage Data
  useEffect(() => {
    const allData = localStorage.getItem("dataInformation");
    if (allData) {
      const data = JSON.parse(allData);
      const address = data.addresses[id];
      setFormData({
        ...data,
        addresses: [address],
      });
    }
  }, [id]);

  // verify PAN number
  const panVerifyData = async () => {
    try {
      const response = await axios.post(
        "https://lab.pixel6.co/api/verify-pan.php",
        {
          panNumber: formData.pan,
        }
      );
      const { isValid, namefull } = response.data;
      if (isValid) {
        setFormData({ ...formData, namefull });
      }
    } catch (error) {
      console.error("Error Data :", error);
    }
  };

  // change this input filed and changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address")) {
      const [items, index] = name.split(".");
      const addresses = [...formData.addresses];
      addresses[index][items] = value;
      setFormData({ ...formData, addresses });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // form update submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const allData = localStorage.getItem("dataInformation");
    if (allData) {
      const data = JSON.parse(allData);
      data.addresses[id] = formData.addresses[0];
      localStorage.setItem("dataInformation", JSON.stringify(data));
      navigate("/getdata");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Customer Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">PAN:</label>
          <input
            type="text"
            className="form-control"
            name="pan"
            onBlur={panVerifyData}
            maxLength="10"
            required
            pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
            placeholder="Enter a valid PAN "
            value={formData.pan}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Full Name:</label>
          <input
            type="text"
            className="form-control"
            name="namefull"
            value={formData.namefull}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile Number:</label>
          <input
            type="text"
            className="form-control"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            pattern="^[0-9]{10}$"
            maxLength="10"
          />
        </div>
        <h3>Address</h3>
        <div className="mb-3">
          <label className="form-label">Address Line 1:</label>
          <input
            type="text"
            className="form-control"
            name="addressLine1.0"
            value={formData.addresses[0]?.addressLine1 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address Line 2:</label>
          <input
            type="text"
            className="form-control"
            name="addressLine2.0"
            value={formData.addresses[0]?.addressLine2 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Postcode:</label>
          <input
            type="text"
            className="form-control"
            name="postcode.0"
            value={formData.addresses[0]?.postcode || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">State:</label>
          <input
            type="text"
            className="form-control"
            name="state.0"
            value={formData.addresses[0]?.state || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">City:</label>
          <input
            type="text"
            className="form-control"
            name="city.0"
            value={formData.addresses[0]?.city || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditForm;
