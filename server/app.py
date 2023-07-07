import discord
import httpx
import asyncio

# Discord bot setup
TOKEN = ''
CHANNEL_ID = 1
client = discord.Client()

# Supabase setup
SUPABASE_URL = ''
SUPABASE_API_KEY = ''

# Fetch planets that have been added to supabase.planetsss table
async def fetch_latest_planet():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f'{SUPABASE_URL}/table/planetsss?select=id,content&order_by=id.desc',
            headers={'apikey': SUPABASE_API_KEY}
        )
        return response.json()

# Create a new thread in the channel when a new planet has been created
async def create_thread(planet_name, planet_id):
    channel = client.get_channel(CHANNEL_ID)
    thread = await channel.create_thread(name=f'🛰️ New planet: {planet_name}', auto_archive_duration=60)
    await thread.send(f'Check out the new planet simulation: https://play.skinetics.tech/tests/planets/{planet_id}')

@client.event
async def on_ready():
    print(f'Logged in as {client.user.name} - {client.user.id}')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.lower() == '!check_new_planet':
        try:
            planets = await fetch_latest_planet()
            if planets:
                planet = planets[0] # Assuming the latest planet is the first one
                await create_thread(planet('content'), planet['id'])
                await message.channel.send('A new thread has been created for the latest planet!')
            else:
                await message.channel.send('No new planets found')
        except Exception as e:
            print('Error: ', e)
            await message.channel.send('An error occured while checking for new planets')

# Run the bot
client.run(TOKEN)