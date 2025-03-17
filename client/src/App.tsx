import React, { useState, useEffect, FormEvent } from "react";
import "./App.css";

interface Data {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  portfolio: string;
}

const App = (): React.JSX.Element => {
  const [data, setData] = useState<Data[]>([]);
  const [inputData, setInputData] = useState<Omit<Data, 'id'>>({
    firstname: "",
    lastname: "",
    email: "",
    portfolio: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<Data | null>(null);

  // Fetch data from server
  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch data:", err));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const newStudent = { ...inputData };

    fetch("http://localhost:5000/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    })
      .then((response) => response.json())
      .then((savedStudent) => {
        setData((prevData) => [...prevData, savedStudent]);
        alert("Added Successfully!");
        setInputData({ firstname: "", lastname: "", email: "", portfolio: "" });
      })
      .catch((err) => console.error("Failed to add data:", err));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    if (currentData) {
      setCurrentData((prevData) => ({
        ...prevData!,
        [name]: value,
      }));
    }
  };

  const handleEditFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!currentData) return;

    fetch(`http://localhost:5000/students/${currentData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentData),
    })
      .then((response) => response.json())
      .then(() => {
        setData((prevData) =>
          prevData.map((item) =>
            item.id === currentData.id ? { ...item, ...currentData } : item
          )
        );
        alert("Updated Successfully!");
        setIsEditing(false);
        setCurrentData(null);
      })
      .catch((err) => console.error("Failed to update data:", err));
  };

  const deleteData = (id: number): void => {
    fetch(`http://localhost:5000/students/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        alert("Deleted Successfully!");
      })
      .catch((err) => console.error("Failed to delete data:", err));
  };

  const editing = (item: Data): void => {
    setIsEditing(true);
    setCurrentData(item);
  };

  return (
    <div>
      {isEditing && currentData ? (
        <form onSubmit={handleEditFormSubmit}>
          <h1>Edit Portfolio</h1>
          {(["firstname", "lastname", "email", "portfolio"] as Array<keyof Data>).map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field}</label>
              <input
                type="text"
                className="form-control"
                id={field}
                name={field}
                value={currentData ? currentData[field] : ""} // Access property safely
                onChange={handleEditInputChange}
              />
            </div>
          ))}
          <button type="submit">Update</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
            <h1>Add Portfolio</h1>
            {(["firstname", "lastname", "email", "portfolio"] as Array<keyof Data>).map((field) => (
              <div className="form-group" key={field}>
                <label htmlFor={field}>{field}</label>
                <input
                  type="text"
                  className="form-control"
                  id={field}
                  name={field}
                  value={(inputData as any)[field]} // Dynamic field access inputData
                  onChange={handleInputChange}
                />
              </div>
            ))}
            <button type="submit">Submit</button>
          </form>
          <ul>
            {data.map((item) => (
              <li key={item.id}>
                {item.firstname} {item.lastname} - {item.email} -{" "}
                {item.portfolio}
                <button onClick={() => deleteData(item.id)}>Delete</button>
                <button onClick={() => editing(item)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
