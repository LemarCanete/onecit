'use client'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import React, {useCallback, useState} from 'react'
import dynamic from 'next/dynamic';
import { BiChat } from 'react-icons/bi';
import data from './org';

const DynamicTree = dynamic(() => import('react-d3-tree'), { ssr: false });

const renderRectSvgNode = ({ nodeDatum, toggleNode }) => (
    <g >
        {/* <rect width="20" height="20" x="-10" onClick={toggleNode} /> */}
        {/* <circle r={20} onClick={toggleNode}/> */}
        <image href="/schoolLogo.png" x="-30" y="-25" width="60" height="60" onClick={toggleNode} />
        <text fill="black" fontSize={16} strokeWidth='0.4' x={40} >
            {nodeDatum.name}
        </text>
        {nodeDatum.position && (
            <text fill="black" x="40" dy="20" strokeWidth="0" fontSize={14}>
            {nodeDatum.position}
            </text>
        )}
        {nodeDatum.position && <BiChat className='text-teal-500' y={30} x={40}/>}
    </g>
  );


const page = () => {
    // const data = {
    //     "name": "CEO",
    //     "attributes": {
    //         "department": "President"
    //     },
    //     "children": [
    //       {
    //         "name": "Manager",
    //         "attributes": {
    //           "department": "Production"
    //         },
    //         "children": [
    //           {
    //             "name": "Foreman",
    //             "attributes": {
    //               "department": "Fabrication"
    //             },
    //             "children": [
    //               {
    //                 "name": "Workers"
    //               }
    //             ]
    //           },
    //           {
    //             "name": "Foreman",
    //             "attributes": {
    //               "department": "Assembly"
    //             },
    //             "children": [
    //               {
    //                 "name": "Workers"
    //               }
    //             ]
    //           }
    //         ]
    //       },
    //       {
    //         "name": "Manager",
    //         "attributes": {
    //           "department": "Marketing"
    //         },
    //         "children": [
    //           {
    //             "name": "Sales Officer",
    //             "attributes": {
    //               "department": "A"
    //             },
    //             "children": [
    //               {
    //                 "name": "Salespeople"
    //               }
    //             ]
    //           },
    //           {
    //             "name": "Sales Officer",
    //             "attributes": {
    //               "department": "B"
    //             },
    //             "children": [
    //               {
    //                 "name": "Salespeople"
    //               }
    //             ]
    //           }
    //         ]
    //       }
    //     ]
    // }
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState();
    const containerRef = useCallback((containerElem) => {
      if (containerElem !== null) {
        const { width, height } = containerElem.getBoundingClientRect();
        setDimensions({ width, height });
        setTranslate({ x: width / 2, y: height / 12 });
      }
    }, []);



    return (
        <div className='w-full h-screen flex bg-neutral-50'>
            <NavbarIconsOnly/>

            <div className="px-10 py-5 grow flex-col justify-center items-center">
                <h1 className="text-3xl">Directory</h1>
                <input type="search" placeholder='Search' className='w-full rounded-lg p-2 my-3'/>

                <div id="treeWrapper" className='w-full h-5/6' ref={containerRef}>
                    <DynamicTree  
                        data={data} 
                        orientation='vertical' 
                        pathFunc='step' 
                        collapsible="true" 
                        draggable="true"
                        translate={translate}
                        enableLegacyTransitions
                        nodeSize={{x: 500, y: 150}}
                        // dimensions={dimensions}
                        svgClassName=' '
                        // leafNodeClassName='border'
                        // branchNodeClassName='border'
                        renderCustomNodeElement={renderRectSvgNode}
                        />
                </div>
            </div>

        </div>
    )
}

export default page

