
async function check() {
    console.log("Fetching WITH iso8601=true...");
    const url = 'https://api.aladhan.com/v1/timings?latitude=-6.2088&longitude=106.8456&method=20&iso8601=true';
    const res = await fetch(url);
    const data = await res.json();
    console.log("Fajr:", data.data.timings.Fajr);

    console.log("Fetching WITHOUT iso8601...");
    const url2 = 'https://api.aladhan.com/v1/timings?latitude=-6.2088&longitude=106.8456&method=20';
    const res2 = await fetch(url2);
    const data2 = await res2.json();
    console.log("Fajr:", data2.data.timings.Fajr);
}

check();
