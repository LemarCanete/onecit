//level 3B
const generateVPAdminestration = () =>({
    "name": "John Gregory B. Escario",
    "attributes": {
        "position": "Vice-President for Administration \n"
    },
    "children": [

    ]
})

//level 3A
const generateVPAcademicAffairs = () =>({
    "name": "Corazon Evangelista – Valencia",
    "attributes": {
        "position": "Vice-President for Academic Affairs"
    },
    "children": [

    ]
})

//level2
const generatePresident = () =>({
    "name": "Bernard Nicolas E. Villamor",
    "attributes": {
        "position": "President"
    },
    "children": [
        generateVPAcademicAffairs(),
        generateVPAdminestration(),

    ]
})

//level 1
const generateBoardOfDirectors = () =>({
    "name": "Board of Directors",
    "children": [generatePresident()]
})

const template = (name, position, group, children) =>{
    return {
        "name": name,
        "attributes": {
            "position": position,
            "group": group,
        },
        "children": [
            children
        ]
    }
}

const data = generateBoardOfDirectors()

export default data