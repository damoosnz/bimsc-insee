import { inseeGet } from "../api/get.js"

function getCreated(date) {
    const dateParts = date.split('-')
    const created = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
    return created
}

function mapInseeAddress(addRes) {

    if (!addRes) return null;

    // street (with type + name, e.g. "RUE FRANCOIS BROUSSE")
    const streetName = [
        addRes.numeroVoieEtablissement,
        addRes.indiceRepetitionEtablissement || "",
        addRes.typeVoieEtablissement || "",
        addRes.libelleVoieEtablissement || ""
    ].filter(Boolean).join(" ")

    // City
    const city = addRes.libelleCommuneEtablissement || addRes.libelleCommuneEtrangerEtablissement;
    // State/Region: INSEE doesn’t return "région" directly here → often needs mapping from `codeCommuneEtablissement` → région.    const state = null;
    // Country: default France if codePaysEtrangerEtablissement is null
    const country = addRes.libellePaysEtrangerEtablissement || "France";
    // Postal code
    const zip = addRes.codePostalEtablissement || addRes.codeCedexEtablissement;

    const address = {
        street: streetName,
        street2: addRes.complementAdresseEtablissement || null,
        city,
        state: null,
        zip,
        country,
    }

    if (streetName?.length > 0 && city?.length > 0 && zip?.length > 0) return address
    return null
}

export const processTools = {
    formatDate: getCreated,
    formatAddress: mapInseeAddress,
}