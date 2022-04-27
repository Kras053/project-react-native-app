import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Accelerometer } from "expo-sensors";

const styles = StyleSheet.create({
    container: {
        padding: 25,
        alignItems: "center",
        justifyContent: "center",
        },
        tinyFrame: {
        width: 300,
        height: 300,
        marginBottom: 25,
        },
        button: {
            width: 175,
            backgroundColor: "black",  
            alignItems: "center",
            padding: 10,
        },
        text: {
            color: "white",
        }
});


const ShakeApi = ()=> {

    const [picture, setPicture] = useState({})

    const generatePicture = () => {
        fetch("https://randomfox.ca/floof/")
        .then(response => response.json())
        .then(data => setPicture(data))
    }

    useEffect(()=> {
        generatePicture();
    }, []);


const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);


const { x, y, z } = data;

  const subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
  };

  const unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
      // component mounts execute the function below
    subscribe();

    // component unmounts execute the function in the return statement
    return () => unsubscribe();
  }, []);


const isShaking = (data) => {
    const totalForce = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);
    return totalForce > 1.78;
}


useEffect(()=> {
    if (isShaking(data)) {
        generatePicture();
    }
}, [data])

    return (
        <View style={styles.container}>
              <Image style={styles.tinyFrame} 
                     source={picture.image}/>
            <TouchableOpacity
            style={styles.button}
            onPress={generatePicture}>
                <Text style={styles.text}>Or click me...</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ShakeApi;