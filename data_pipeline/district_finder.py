import requests

zipcode = "90210"

# Step 1: look up location
url = f"https://api.zippopotam.us/us/{zipcode}"

response = requests.get(url)
data = response.json()

state = data["places"][0]["state abbreviation"]

print("ZIP:", zipcode)
print("State:", state)

# Step 2: estimate congressional district (temporary placeholder)

district = "32"

print("Estimated District:", state + "-" + district)