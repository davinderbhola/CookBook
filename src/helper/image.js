import { View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated from 'react-native-reanimated';

const CachedImage = (props) => {

    // console.warn("cached image component render with data: ", props);
    const [cachedSource, setCachedSource] = useState(null);
    const {uri} = props?.source;

    useEffect(()=>{
        const getCachedImage = async ()=>{  
            try{
                const cachedImageData = await AsyncStorage.getItem(uri);
                if (cachedImageData){
                    setCachedSource({uri: cachedImageData});
                }else{
                    const response = await fetch(uri);
                    const imageBlob = await response.blob();
                    const base64Data = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(imageBlob);
                        reader.onloadend = () => {
                            resolve(reader.result);
                        };
                    });
                    await AsyncStorage.setItem(uri, base64Data);
                    setCachedSource({uri: base64Data});
                }
            }catch(error){
                console.error('Error caching image file ', error);
                setCachedSource({uri});
            }
        }

        getCachedImage(); 
    }, [])
    
  return <Animated.Image source={cachedSource} {...props}/>
}

export default CachedImage