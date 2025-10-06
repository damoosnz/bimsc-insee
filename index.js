import { fetchInsee } from "./lib/helper/fetch-insee.js"
import { inseeGet } from "./lib/api/get.js"
import { inseeGets } from "./lib/api/gets.js"
import { inseeProcess } from "./lib/process/insee-process.js"

export const insee = {
    api: {
        siret: inseeGet.siret,
        sirets: inseeGets.sirets,
        siren: inseeGet.siren,
        sirens: inseeGets.sirens, 
        cat: inseeGet.cat,
        naf: inseeGet.naf,
    },
    helper: {
        fetch: fetchInsee,
    },
    process: inseeProcess
}