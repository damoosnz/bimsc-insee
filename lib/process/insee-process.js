
import { processSiren } from "./siren.js"
import { processSiret } from "./siret.js"

export const inseeProcess = {
    getHqSiretFromSiren,
    siren: processSiren,
    siret: processSiret
}


function getHqSiretFromSiren(sd) {

    const current = sd.periodesUniteLegale.find(per => per.dateFin === null)
    if (!current) return null
    const nic = current.nicSiegeUniteLegale
    if (!nic) return null
    const siret = sd.siren + nic
    return siret
}












