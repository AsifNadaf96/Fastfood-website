import React, { useEffect, useState } from 'react';

const API = "http://localhost:5000/api/admin/menu"; // Adjust accordingly

const AdminMenu = () => {
  const [menus, setMenus] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    const res = await fetch(API, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setMenus(data);
  };

  const handleAdd = async () => {
    if (!newItem.name || !newItem.price) return alert("Name and Price required");
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newItem)
    });
    if (res.ok) {
      setNewItem({ name: '', price: '', description: '' });
      fetchMenus();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) fetchMenus();
  };

  return (
    <div>
      <h2>Menu Management</h2>
      <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
      <input placeholder="Price" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
      <input placeholder="Description" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
      <button onClick={handleAdd}>Add Item</button>

      <ul>
        {menus.map(menu => (
          <li key={menu._id}>
            {menu.name} - ${menu.price} <button onClick={() => handleDelete(menu._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMenu;
