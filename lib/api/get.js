import { fetchInsee } from "../helper/fetch-insee.js"

async function inseeSiretGet(siret) {

    const url = `https://api.insee.fr/api-sirene/3.11/siret/${siret}`
    const res = await fetchInsee(url, siret)
    if (!res.err) return { key: siret, val: res.val.etablissement }
    if (res.err) return res

}

async function inseeSirenGet(siren) {
    const url = `https://api.insee.fr/api-sirene/3.11/siren/${siren}`
    const res = await fetchInsee(url, siren)
    if (!res.err) return { key: siren, val: res.val.uniteLegale }
    if (res.err) return res
}

async function inseeNafGet(code, norm) {

    let url = 'https://api.insee.fr/metadonnees'
    if (norm === 'NAFRev2') url += `/codes/nafr2/sousClasse/${code}`
    if (norm === 'NAF1993') url += `/codes/nafr1/sousClasse/${code}`

    const res = await fetchInsee(url, code)
    return res
}


async function inseeCatGet(code, type = 'n3') {

    let url = 'https://api.insee.fr/metadonnees'
    if (type === "n2") url += `/codes/cj/n2/${code}`
    if (type === "n3") url += `/codes/cj/n3/${code}`
    const res = await fetchInsee(url, code)
    return res
}

export const inseeGet = {
    siret: inseeSiretGet,
    siren: inseeSirenGet,
    cat: inseeCatGet,
    naf: inseeNafGet
}

