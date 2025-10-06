
export async function fetchInsee(url, key) {

    const apiKey = process.env.INSEE_API_KEY

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'X-INSEE-Api-Key-Integration': apiKey,
            'Accept': 'application/json'
        }
    })

    try {
        if (!res.ok) {
            const text = await res.text()
            console.log(text)
            return { key, val: null, err: text };
        }
        return { key, val: await res.json(), err: null }

    } catch (error) {
        console.error('Error fetching data:', error);
        return { key, val: null, err: text }
    }

}
