import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {Layout, Section, SectionContent, Text} from 'react-native-rapi-ui';
import {collabData, disconnectCollab} from '../../App';

export default function ({navigation}) {
    const handleLogout = async () => {
        await disconnectCollab();
        navigation.navigate('Login');
    };

    return (
        <Layout>
            <View>
                <Section>
                    <SectionContent>
                        <Text>Vos informations </Text>
                    </SectionContent>
                </Section>
                <Button title="Se déconnecter" color="red" onPress={handleLogout}/>
            </View>
        </Layout>
    );
}

