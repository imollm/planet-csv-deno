import * as log from "https://deno.land/std@0.155.0/log/mod.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js"

interface Launch {
    fligthNumber: number
    mission: string
    rocket: string
    customers: Array<string>
}

const launches = new Map<number, Launch>();

export async function downloadLaunchData() {
    const response = await fetch("https://api.spacexdata.com/v3/launches", {
        method: "GET"
    })

    if (!response.ok) {
        console.log("Problem downloading launch data - ", response.statusText);
        throw new TypeError("Launch data download failed.")
    }

    const launchData = await response.json();
    for (const launch of launchData) {
        const payloads = launch.rocket.second_stage.payloads
        const customers = _.flatMap(payloads, (payload: any) => {
            return payload.customers
        })

        const fligthData = {
            fligthNumber: launch.flight_number,
            mission: launch.mission_name,
            rocket: launch.rocket.rocket_name,
            customers: customers
        }
        launches.set(fligthData.fligthNumber, fligthData)
        log.info(JSON.stringify(fligthData))
    }
}

if (import.meta.main) {
    await downloadLaunchData();
    log.info(JSON.stringify(import.meta))
    log.info(`Downloaded data for ${launches.size} SpaceX launches.`)
}
