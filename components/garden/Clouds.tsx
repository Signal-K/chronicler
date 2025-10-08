import React from 'react';
import { Dimensions, View } from 'react-native';
import { cloudsStyles as styles } from '../../styles/garden/CloudsStyles';

const { width: screenWidth } = Dimensions.get('window');

interface CloudData {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface CloudsProps {
  clouds: CloudData[];
  cloudOffset: number;
}

export default function Clouds({ clouds, cloudOffset }: CloudsProps) {
  return (
    <>
      {clouds.map((cloud) => (
        <View key={cloud.id} style={styles.cloudContainer}>
          {/* Cloud circles to create cloud shape */}
          <View 
            style={[
              styles.cloudCircle,
              {
                left: (cloud.x + cloudOffset * cloud.speed) % (screenWidth + 200) - 100,
                top: cloud.y,
                width: cloud.size * 1.2,
                height: cloud.size * 1.2,
                borderRadius: cloud.size * 0.6,
              }
            ]}
          />
          <View 
            style={[
              styles.cloudCircle,
              {
                left: (cloud.x + cloudOffset * cloud.speed) % (screenWidth + 200) - 50,
                top: cloud.y,
                width: cloud.size * 1.6,
                height: cloud.size * 1.6,
                borderRadius: cloud.size * 0.8,
              }
            ]}
          />
          <View 
            style={[
              styles.cloudCircle,
              {
                left: (cloud.x + cloudOffset * cloud.speed) % (screenWidth + 200),
                top: cloud.y,
                width: cloud.size * 2,
                height: cloud.size * 2,
                borderRadius: cloud.size,
              }
            ]}
          />
        </View>
      ))}
    </>
  );
}