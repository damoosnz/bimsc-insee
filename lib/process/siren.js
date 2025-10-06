import { processTools } from "./common-tools.js"
import { inseeGet } from "../api/get.js"

function getHqSiretFromSiren(sr) {
    const current = sr.periodesUniteLegale.find(per => per.dateFin === null)
    if (!current) return null
    const nic = current.nicSiegeUniteLegale
    if (!nic) return null
    const siret = sr.siren + nic
    return siret
}

function sirenVisibility(sr) {
    return sr.statutDiffusionUniteLegale
}

function sirenCreation(sr) {
    if (sr.dateCreationUniteLegale) return processTools.formatDate(sr.dateCreationUniteLegale)
    return null
}

function sirenValidityPeriod(sr) {
    const validPeriod = sr.periodesUniteLegale.find(per => per.dateFin === null)
    if (validPeriod) return validPeriod
    return null
}

function sirenValidity(sr) {
    const validPeriod = sirenValidityPeriod(sr)
    if (validPeriod) return validPeriod.etatAdministratifUniteLegale
    return null
}

function sirenCompanyName(sr) {

    const vis = sirenVisibility(sr)
    if (vis !== 'O') return null
    const per = sirenValidityPeriod(sr)
    if (!per) return null
    // morale
    if (per.denominationUniteLegale) return per.denominationUniteLegale
    // physique
    if (per.nomUniteLegale) {
        const tradingName = per.denominationUsuelle1UniteLegale
        if (tradingName) return tradingName
        const lastname = per.nomUniteLegale
        const fristName = sr.uniteLegale.prenom1UniteLegale
        return `${fristName} ${lastname}`
    }
    return null
}

async function sirenActivity(sr, nafs = {}) {

    const per = sirenValidityPeriod(sr)
    if (!per) return null

    const code = per.activitePrincipaleUniteLegale
    const norm = per.nomenclatureActivitePrincipaleUniteLegale
    if (nafs[code]) return nafs[code]

    const res = await inseeGet.naf(code, norm)
    if (res.err) return null

    const activity = res.val
    nafs[activity.code] = activity.intitule
    return { [activity.code]: activity.intitule }

}

async function sirenCategory(sr, cats = {}) {

    const per = sirenValidityPeriod(sr)
    if (!per) return null

    const code = per.categorieJuridiqueUniteLegale
    if (cats[code]) return cats[code]

    const res = await inseeGet.cat(code)
    if (res.err) return null

    const category = res.val
    cats[category.code] = category.intitule
    return { [category.code]: category.intitule }

}

export const processSiren = {
    getSiretFromSiren: getHqSiretFromSiren,
    visibility: sirenVisibility,
    creation: sirenCreation,
    validity: sirenValidity,
    denomination: sirenCompanyName,
    activity: sirenActivity,
    category: sirenCategory
}