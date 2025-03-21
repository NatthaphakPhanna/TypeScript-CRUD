import { useState, useEffect } from 'react';
import './App.css';

// ประเภทของข้อมูลที่ใช้ใน CRUD
type Data = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  portfolio: string;
};

type inputData = Omit<Data, "id">;

const App = (): React.JSX.Element => {
  const [data, setData] = useState<Data[]>([]);
  const [input, setInput] = useState<inputData>({firstname: '',lastname: '',email: '',portfolio: '',});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedItem, setEditedItem] = useState<Data | null>(null)

  // ตั้งค่า title และ meta tag
  useEffect(() => {
    const setMetaData = (): void => {
      document.title = 'React CRUD + TypeScript';

      // Meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'A React application demonstrating CRUD operations with TypeScript.');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = 'A React application demonstrating CRUD operations with TypeScript.';
        document.head.appendChild(meta);
      }

      // Meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', 'React, CRUD, TypeScript, API, Frontend Development');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = 'React, CRUD, TypeScript, API, Frontend Development';
        document.head.appendChild(meta);
      }
    };

    setMetaData();
  }, []); // ทำงานครั้งแรกเมื่อโหลดหน้า

  // Fetch data จาก backend
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response: Response = await fetch('http://localhost:5000/students', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Data[] = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // เพิ่มข้อมูลใหม่ (Create)
  const handleFormSubmit = async (): Promise<void> => {
    try {
      const response: Response = await fetch(`http://localhost:5000/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newData: Data = await response.json();
      setData([...data, newData]);
      setInput({ firstname: '', lastname: '', email: '', portfolio: '' });
    } catch (err) {
      console.error(err);
    }
  };

  // ลบข้อมูล (Delete)
  const deleteData = async (id: number): Promise<void> => {
    try {
      const response: Response = await fetch(`http://localhost:5000/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setData(data.filter((item: Data) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // แก้ไขข้อมูล (Edit)
  const editData = async (id: number): Promise<void> => {
    try {
      const response: Response = await fetch(`http://localhost:5000/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedItem),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedData: Data = await response.json();
      setData(data.map((item: Data) => (item.id === id ? updatedData : item)));
      setIsEditing(false);
      setEditedItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  // เริ่มต้นการแก้ไข
  const startEdit = (item: Data): void => {
    setIsEditing(true);
    setEditedItem(item);
  };


  // รายชื่อฟิลด์ input
  const inputFields: Array<keyof inputData> = ["firstname", "lastname", "email", "portfolio"];

  // จัดการการเปลี่ยนแปลงของ input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setInput((prevInput: inputData) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  // จัดการการเปลี่ยนแปลงของ input ในโหมดแก้ไข
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setEditedItem((prevItem: Data | null) => prevItem ? ({
      ...prevItem, [name]: value
    }) : null);
  };

  return (
    <div>

      {isEditing ? (
          <form>
            {editedItem && inputFields.map((item: keyof inputData) => (
              <div key={item} >
                <label htmlFor={item}>{item}: </label>
                <input
                  type="text"
                  id={item}
                  name={item}
                  value={editedItem[item]}
                  onChange={handleEditInputChange}
                />
              </div>
            ))}
            <button onClick={() => editData(editedItem?.id as number)}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button> 
          </form>
      ) : (
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleFormSubmit();
        }}>
          {inputFields.map((item: keyof inputData) => (
            <div key={item}>
              <label htmlFor={item}>{item}:</label>
              <input
                type="text"
                id={item}
                name={item}
                value={input[item]}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <button type='submit'>Submit</button>
      </form>
      )}

      {/* แสดงข้อมูล */}
      {data.map((item: Data) => (
        <ul key={item.id}>
          <li>
            (ID: {item.id}) -
            (User: {item.firstname} {item.lastname}) -
            (Email: {item.email}) -
            (Portfolio: {item.portfolio})
          </li>
          <button onClick={() => deleteData(item.id)}>Delete</button>
          <button onClick={() => startEdit(item)}>Edit</button>
        </ul>
      ))}
    </div>
  );
};

export default App;
