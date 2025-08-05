import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default function PerfilScreen({ navigation }) {
    // TODO: substituir mocks por estado e lógica de fetch
    const [user, setUser] = useState({
        username: 'SeuUsuário',
        photoUrl: null,               // url da foto de perfil
        trailsCompleted: 0,           // número de trilhas já concluídas
        bestTrailTime: '--:--'        // menor tempo
    });
    const [trails, setTrails] = useState([
        /*  
        { id: '1', name: 'Trilha X', bestTime: '00:45:23' },
        { id: '2', name: 'Trilha Y', bestTime: '01:10:05' },
        */
    ]);

    useEffect(() => {
        // TODO: aqui você faz fetch('/users/me/progress') usando o token JWT
        // e popula setUser({ … }) e setTrails( arrayDeTrails )
    }, []);

    const renderTrail = ({ item }) => (
        <View style={styles.trailItem}>
            <Text style={styles.trailName}>{item.name}</Text>
            <Text style={styles.trailTime}>{item.bestTime}</Text>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header: foto + nome */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    // TODO: navegar para um cropper de foto ou galeria
                }}>
                    {user.photoUrl
                        ? <Image source={{ uri: user.photoUrl }} style={styles.profileImage} />
                        : <View style={styles.profilePlaceholder}>
                              <Text style={styles.photoText}>Foto</Text>
                          </View>
                    }
                </TouchableOpacity>
                <Text style={styles.username}>{user.username}</Text>
            </View>

            {/* Estatísticas gerais */}
            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{user.trailsCompleted}</Text>
                    <Text style={styles.statLabel}>Trilhas feitas</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{user.bestTrailTime}</Text>
                    <Text style={styles.statLabel}>Melhor tempo</Text>
                </View>
            </View>

            {/* Lista de trilhas e menores tempos */}
            <Text style={styles.sectionTitle}>Histórico de Trilhas</Text>
            <FlatList
                data={trails}
                keyExtractor={item => item.id}
                renderItem={renderTrail}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhuma trilha registrada.</Text>
                }
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ccc'
    },
    profilePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center'
    },
    photoText: {
        color: '#888'
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 15
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30
    },
    statBox: {
        alignItems: 'center'
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold'
    },
    statLabel: {
        fontSize: 14,
        color: '#555'
    },
    sectionTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600'
    },
    trailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    trailName: {
        fontSize: 16
    },
    trailTime: {
        fontSize: 16,
        color: '#517300'
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20
    }
});