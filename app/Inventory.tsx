import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Inventory() {
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const loadInventory = async () => {
            const storedInventory = await AsyncStorage.getItem("inventory");
            setInventory(storedInventory ? JSON.parse(storedInventory) : []);
        };

        loadInventory();
    }, []);

     const renderItem = ({ item }: { item: any }) => (
       <View style={styles.item}>
             <Text style={styles.itemName}>{item.name}</Text>
             <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
         </View>
     );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inventory</Text>
            <Text style={styles.description}>Your harvested crops</Text>
            {inventory.length > 0 ? (
                <FlatList
                    data={inventory}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            ) : (
                <Text style={styles.emptyMessage}>Your inventory is empty</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#555',
    },
    item: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemQuantity: {
        fontSize: 16,
        color: '#555',
    },
    emptyMessage: {
        fontSize: 16,
        color: "#999",
        textAlign: 'center',
        marginTop: 50,
    },
});