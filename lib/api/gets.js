import { bimscJs } from "bimsc-js-utils"
import { inseeGet } from "./get.js"

export async function inseeSiretsGet(sirets) {

    const calls = sirets.map(s => () => inseeGet.siret(s))
    const results = await bimscJs.promises.stagger(calls, 2100)
    const valids = results.filter(r => r.val !== null)
    const errs = results.filter(r => r.err)
    return [valids, errs]

}

export async function inseeSirensGet(sirens) {

    const calls = sirens.map(s => () => inseeGet.siren(s))
    const results = await bimscJs.promises.stagger(calls, 2100)
    const valids = results.filter(r => r.val !== null)
    const errs = results.filter(r => r.err)
    return [valids, errs]
    
}

export const inseeGets = {
    sirets: inseeSiretsGet,
    sirens: inseeSirensGet,
}