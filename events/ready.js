module.exports = (client, activity) => {
    console.log(`Logged In As ${client.user.tag}!`);
    client.user.setActivity(activity);
}