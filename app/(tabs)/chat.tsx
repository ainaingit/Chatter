import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

// Dummy data for chat list
const chatData = [
    {
        id: '1',
        name: 'Alice Johnson',
        lastMessage: 'See you tomorrow!',
        time: '09:45',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        unread: 2,
    },
    {
        id: '2',
        name: 'Bob Smith',
        lastMessage: 'Thanks for the update.',
        time: '08:30',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        unread: 0,
    },
    {
        id: '3',
        name: 'Clara Lee',
        lastMessage: 'Let’s catch up soon!',
        time: 'Yesterday',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        unread: 1,
    },
];

const ChatListItem = ({
    name,
    lastMessage,
    time,
    avatar,
    unread,
    onPress,
}: {
    name: string;
    lastMessage: string;
    time: string;
    avatar: string;
    unread: number;
    onPress: () => void;
}) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress} activeOpacity={0.7}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={styles.textContainer}>
            <View style={styles.row}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.time}>{time}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {lastMessage}
                </Text>
                {unread > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{unread}</Text>
                    </View>
                )}
            </View>
        </View>
    </TouchableOpacity>
);

export default function ChatListScreen() {
    const handlePress = (id: string) => {
        // Navigate to chat detail
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Chats</Text>
            <FlatList
                data={chatData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatListItem
                        name={item.name}
                        lastMessage={item.lastMessage}
                        time={item.time}
                        avatar={item.avatar}
                        unread={item.unread}
                        onPress={() => handlePress(item.id)}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        paddingTop: 56,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 24,
        color: '#22223B',
        letterSpacing: -1,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#22223B',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#E9ECEF',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#22223B',
        flex: 1,
    },
    time: {
        fontSize: 13,
        color: '#9A8C98',
        marginLeft: 8,
    },
    lastMessage: {
        fontSize: 15,
        color: '#4A4E69',
        flex: 1,
        marginTop: 4,
    },
    unreadBadge: {
        backgroundColor: '#3A86FF',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    separator: {
        height: 12,
    },
});