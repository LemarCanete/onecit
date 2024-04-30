'use client'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import React, {useCallback, useState} from 'react'
import dynamic from 'next/dynamic';
import { BiChat } from 'react-icons/bi';
import data from '../org';
import { useRouter } from 'next/navigation'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

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
        {/* {nodeDatum.position && <BiChat className='text-teal-500' y={30} x={40}/>} */}
    </g>
);

const page = () => {
    const router = useRouter();
    
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
                <div className="flex gap-20 items-center mb-5">
                    <button onClick={()=>router.back()}>
                        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] text-[#F5F5F5] rounded-full p-2 m-2 '/>Go back
                    </button>
                    <h1 className="text-2xl">Interactive Directory</h1>
                </div>
                {/* <input type="search" placeholder='Search' className='w-full p-2 my-3 text-sm border-b outline-none'/> */}

                <div id="treeWrapper" className='w-full h-5/6 bg-white/50 shadow-lg' ref={containerRef}>
                    <DynamicTree  
                        data={data} 
                        orientation='vertical' 
                        pathFunc='step' 
                        collapsible="true" 
                        draggable="true"
                        translate={translate}
                        enableLegacyTransitions
                        nodeSize={{x: 400, y: 150}}
                        // dimensions={dimensions}
                        svgClassName=' '
                        // leafNodeClassName='border'
                        // branchNodeClassName='border'
                        renderCustomNodeElement={renderRectSvgNode}
                        depthFactor={0}
                        initialDepth={2}
                        dimensions={dimensions}
                        shouldCollapseNeighborNodes="true"
                        separation={{nonSiblings: 3, siblings: 1.6}}
                    />
                </div>
            </div>

        </div>
    )
}

export default page

