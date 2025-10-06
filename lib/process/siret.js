import { processTools } from "./common-tools.js"
import { inseeGet } from "../api/get.js"

function siretVisibility(st) {
    return st.statutDiffusionEtablissement
}

function siretCreation(st) {
    if (st.dateCreationEtablissement) return processTools.formatDate(st.dateCreationEtablissement)
    return null
}

function siretValidityPeriod(st) {
    const validPeriod = st.periodesEtablissement.find(per => per.dateFin === null)
    if (validPeriod) return validPeriod
    return null
}

function siretValidity(st) {
    const validPeriod = siretValidityPeriod(st)
    if (validPeriod) return validPeriod.etatAdministratifEtablissement
    return null
}

async function siretActivity(st, nafs = {}) {

    const per = siretValidityPeriod(st)
    if (!per) return null

    const code = per.activitePrincipaleEtablissement
    const norm = per.nomenclatureActivitePrincipaleEtablissement
    if (nafs[code]) return nafs[code]

    const res = await inseeGet.naf(code, norm)
    if (res.err) return null

    const activity = res.val
    nafs[activity.code] = activity.intitule
    return { [activity.code]: activity.intitule }
}

function siretAddress(st) {
    const vis = siretVisibility(st)
    if (vis !== 'O') return null
    const address1 = processTools.formatAddress(st.adresseEtablissement)
    const address2 = processTools.formatAddress(st.adresse2Etablissement)
    if (address2) return address2
    if (address1) return address1
    return null
}

export const processSiret = {
    visibility: siretVisibility,
    creation: siretCreation,
    validity: siretValidity,
    activity: siretActivity,
    address: siretAddress,
}