import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GetData = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Retrieve data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("dataInformation");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  // redirect to edit pages
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  // Delete this data veriyfy by id
  const handleDelete = (id) => {
    const storedData = localStorage.getItem("dataInformation");
    if (storedData) {
      const data = JSON.parse(storedData);
      data.addresses.splice(id, 1);
      localStorage.setItem("dataInformation", JSON.stringify(data));
      setData(data);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Customer Data</h2>
      {data.addresses && data.addresses.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>S.No</th>
              <th>PAN</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Address Line 1</th>
              <th>Address Line 2</th>
              <th>Postcode</th>
              <th>State</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.addresses.map((address, item) => (
              <tr key={item}>
                <td>{item + 1}</td>
                <td>{data.pan}</td>
                <td>{data.fullName}</td>
                <td>{data.email}</td>
                <td>{data.mobileNumber}</td>
                <td>{address.addressLine1}</td>
                <td>{address.addressLine2}</td>
                <td>{address.postcode}</td>
                <td>{address.state}</td>
                <td>{address.city}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default GetData;
