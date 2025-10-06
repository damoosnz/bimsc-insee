import { processTools } from "./common-tools.js"

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
        const fristName = per.prenom1UniteLegale
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

    const activity = await processTools.getNaf(code, norm)
    if (activity) {
        nafs[activity.code] = activity.intitule
        return { [activity.code]: activity.intitule }
    }
    return null
}

async function sirenCategory(sr, cats = {}) {

    const per = sirenValidityPeriod(sr)
    if (!per) return null

    const code = per.categorieJuridiqueUniteLegale
    if (cats[code]) return cats[code]

    const category = await processTools.getCat(code)
    if (category) {
        cats[category.code] = category.intitule
        return { [category.code]: category.intitule }
    }
    return null

}

export const processSiren = {
    visibility: sirenVisibility,
    creation: sirenCreation,
    validity: sirenValidity,
    denomination: sirenCompanyName,
    activity: sirenActivity,
    category: sirenCategory
}