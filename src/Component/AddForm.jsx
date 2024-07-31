import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddForm = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    pan: "",
    namefull: "",
    email: "",
    mobile: "",
    addresses: [
      {
        addressLine1: "",
        addressLine2: "",
        postcode: "",
        state: "",
        city: "",
      },
    ],
  });


  // chnage this input form data 
  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.index !== undefined) {
      const addresses = [...formData.addresses];
      addresses[dataset.index][name] = value;
      setFormData({ ...formData, addresses });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        {
          addressLine1: "",
          addressLine2: "",
          postcode: "",
          state: "",
          city: "",
        },
      ],
    });
  };

  const panVerifyData = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error Data :", error);
    }
  };

  const getAllPostData = async (postcode) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://lab.pixel6.co/api/get-postcode-details.php",
        {
          postcode,
        }
      );
      const { city, state } = response.data;
      setStates(state.map((b) => ({ id: b.id, name: b.name })));
      setCities(city.map((l) => ({ id: l.id, name: l.name })));
      setFormData((prevData) => ({
        ...prevData,
        addresses: prevData.addresses.map((item) =>
          item.postcode === postcode
            ? { ...item, state: state[0]?.name, city: city[0]?.name }
            : item
        ),
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error getting postcode details:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.pan ||
      !formData.namefull ||
      !formData.email ||
      !formData.mobile
    ) {
      alert("Please fill all required fields");
      return;
    }

    localStorage.setItem("dataInformation", JSON.stringify(formData));

    console.log("Form data submitted:", formData);
    navigate("/getdata");
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mt-4">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">PAN Number:</label>
                <input
                  type="text"
                  className="form-control"
                  name="pan"
                  value={formData.pan}
                  onChange={(e) => handleChange(e)}
                  onBlur={panVerifyData}
                  maxLength="10"
                  required
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  placeholder="Enter a valid PAN "
                />
                {loading && <span>Loading...</span>}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Full Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="namefull"
                  value={formData.namefull}
                  onChange={(e) => handleChange(e)}
                  required
                  maxLength="140"
                  placeholder="Enter Name"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  maxLength="255"
                  required
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  placeholder="email address"
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Mobile Number:</label>
                <input
                  type="text"
                  className="form-control"
                  name="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleChange(e)}
                  maxLength="10"
                  required
                  pattern="^[0-9]{10}$"
                  placeholder="mobile number"
                />
              </div>
            </div>

            {formData.addresses.map((address, index) => (
              <div className="col-md-6" key={index}>
                <h3>Address {index + 1}</h3>
                <div className="mb-3">
                  <label className="form-label">Address Line 1:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="addressLine1"
                    data-index={index}
                    value={address.addressLine1}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address Line 2:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="addressLine2"
                    data-index={index}
                    value={address.addressLine2}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Postcode:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="postcode"
                    data-index={index}
                    value={address.postcode}
                    onChange={(e) => {
                      handleChange(e);
                      if (e.target.value.length === 6) {
                        getAllPostData(e.target.value);
                      }
                    }}
                    maxLength="6"
                    required
                    pattern="^[0-9]{6}$"
                    title="Enter a valid postcode (6 digits)"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">State:</label>
                  <select
                    className="form-select"
                    name="state"
                    data-index={index}
                    value={address.state}
                    onChange={(e) => handleChange(e)}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">City:</label>
                  <select
                    className="form-select"
                    name="city"
                    data-index={index}
                    value={address.city}
                    onChange={(e) => handleChange(e)}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            
                       <div>
                       <button type="button" className="col-md-6 mb-3" onClick={handleAddAddress}>
                Add Another Address
              </button>
                       </div>
              <button type="submit" className="btn btn-primary col-md-6">
                Submit
              </button>
            
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
