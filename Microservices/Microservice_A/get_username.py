import requests


def get_username():
    """
    Username generator that requests a random username from a open source API.
    API: https://github.com/randomusernameapi/randomusernameapi.github.io
    Returns:
        __str__: "username"
    """
    try:

        url = 'https://usernameapiv1.vercel.app/api/random-usernames'
        r = requests.get(url, timeout=10)
        username = r.json()
        return username['usernames'][0]
    except requests.exceptions.RequestException as err:
        print(f"Request failed: {err}")
    except ValueError as err:
        print(f"Error JSON response: {err}")


if __name__ == "__main__":
    get_username()
