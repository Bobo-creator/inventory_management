'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography, IconButton, Card, CardContent } from '@mui/material';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [initialQuantity, setInitialQuantity] = useState(1);

  // Convert item name to lowercase for case-insensitive operations
  const normalizeItemName = (name) => name.toLowerCase();

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item, quantity = 1) => {
    const normalizedItem = normalizeItemName(item);
    const docRef = doc(collection(firestore, 'inventory'), normalizedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: existingQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const normalizedItem = normalizeItemName(item);
    const docRef = doc(collection(firestore, 'inventory'), normalizedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const deleteItem = async (item) => {
    const normalizedItem = normalizeItemName(item);
    const docRef = doc(collection(firestore, 'inventory'), normalizedItem);
    await deleteDoc(docRef);
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(({ name }) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={2}
      sx={{
        backgroundImage: 'url(https://www.echelonedge.com/wp-content/uploads/2023/05/Network-Inventory-Management.png)',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={3}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)',
          }}
        >
       
          <Typography variant="h6" color="#333" align="center">Add Item</Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              variant="outlined"
              label="Item Name"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
              fullWidth
            />
            <TextField
              variant="outlined"
              label="Initial Quantity"
              type="number"
              value={initialQuantity}
              onChange={(e) => {
                setInitialQuantity(Number(e.target.value));
              }}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName, initialQuantity);
                setItemName('');
                setInitialQuantity(1);
                handleClose();
              }}
              fullWidth
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Typography variant="h3" color="white" align="center">
          Inventory Items
        </Typography>
      <Stack direction="row" spacing={2} alignItems="center" width="100%" maxWidth={800} mt={4}>
        <TextField
          variant="outlined"
          placeholder="Search Items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            bgcolor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            flex: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add New Item
        </Button>
      </Stack>

     
      <Box
        width="100%"
        maxWidth={800}
        mt={4}
        p={2}
        bgcolor="#fff"
        borderRadius={3}
        boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
      >
        
        <Box
          width='100%'
          mt={2}
          overflow="auto"
          borderRadius={3}
          p={1}
          sx={{
            maxHeight: '400px',
            border: '1px solid #ddd',
          }}
        >
          <Stack spacing={2} bgcolor="#CBC3E3">
            {filteredInventory.map(({ name, quantity }) => (
              <Card key={name} sx={{ borderRadius: 2, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                  }}
                >
                  <Typography variant="h6" color="#333">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" color="#333">
                    {quantity}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton onClick={() => addItem(name)} color="primary">
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => removeItem(name)} color="secondary">
                      <RemoveIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteItem(name)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
