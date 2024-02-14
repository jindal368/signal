const getMatchedUserInfo = (users , loggedIn) => {
    const newUsers = { ...users }
    delete newUsers[loggedIn]

    const [id, user] = Object.entries(newUsers).flat()
    
    return {id , ...user}
}
export default getMatchedUserInfo