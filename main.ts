import { readFile, rm, writeFile } from "fs/promises";
import { motto } from "./config/config";
import { injection_recent_star, injection_learncode, injection_SmallToys, open_source_project, injection_footer } from './auxiliary/injection'
import { getcon } from "./auxiliary/util";

async function main() {
    const template = await readFile('./readme.template.md', { encoding: 'utf-8' })
    let newCon = template
    
    newCon = (await injection_SmallToys(newCon)).toString()
    newCon = (await injection_learncode(newCon)).toString()
    newCon = (await injection_recent_star(newCon)).toString()
    newCon = (await open_source_project(newCon)).toString()
    newCon = injection_footer(newCon)
    newCon = newCon.replace(getcon('MOTTO'), motto)

    await rm('./README.md', { force: true })
    await writeFile('./README.md', newCon, { encoding: 'utf-8' })
}

main()