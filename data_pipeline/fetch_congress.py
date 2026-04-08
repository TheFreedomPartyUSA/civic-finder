import requests
import sqlite3

# your congress API key
API_KEY = "DeUjZffFBNwdvRrw7jVrTGB0aSqdkhYPjldGPhNR"

# congress API endpoint
url = f"https://api.congress.gov/v3/member?api_key={API_KEY}&limit=50"

# request data from congress API
response = requests.get(url)

data = response.json()

# connect to database
connection = sqlite3.connect("../backend/freedomparty.db")

cursor = connection.cursor()

members = data["members"]

for member in members:

    name = member["name"]
    party = member["partyName"]
    state = member["state"]

    cursor.execute("""
    INSERT INTO politicians (name, position, party, state)
    VALUES (?, ?, ?, ?)
    """, (name, "Congress Member", party, state))

connection.commit()
connection.close()

print("Congress members added to database.")