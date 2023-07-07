use serenity::{
    async_trait,
    model::{gateway::Activity, channel:MEssage},
    prelude::*,
    http:Http,
};

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn message(&self, ctx: Context, msg: Message) {
        if msg.content == "!newplanet" {
            let planet_id = "";
            let planet_url = format!("https://play.skinetics.tech/tests/planets/{}", planet_id);
            let channel_id = ChannelId();
            let content = format!("A new planet has been added: {}", planet_url);

            // Send message to channel
            if let Err(why) = channel_id.say(&ctx.http, &content).wait {
                println(!"Error sending message: {:?}", why);
            }
        }
    }
}

#[tokio::main]
async fn main() {
    let token = "";
    let http = Http::new_with_token(&token);

    let framework = StandardFramework::new()
        .configure(|c| c.prefix("!"))
        .group(&GENERAL_GROUP);

    let mut client = Client::builder(&token)
        .event_handler(Handler)
        .framework(framework)
        .await
        .expect("Error creating client");

    if let Err(why) = client.start().await {
        println!("Client error: {:?}", why);
    }
}