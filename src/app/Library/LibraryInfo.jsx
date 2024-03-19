import React from 'react'
import { BsInfoCircle, BsX } from 'react-icons/bs'
import * as Popover from '@radix-ui/react-popover';
import { BiSolidRightArrow } from 'react-icons/bi';

const LibraryInfo = () => {
    return (
        <div className=''>
            <Popover.Root>
                <Popover.Trigger>
                    <p className="text-2xl cursor-pointer"><BsInfoCircle /></p>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content>
                        <div className="bg-black/75 text-white p-3 relative ms-56 rounded text-sm shadow-2xl">
                            <h1 className="text-md font-bold mb-2">CIT Librarians</h1>
                            <p className="py-1"> <BiSolidRightArrow className='inline me-2'/>
                                Mrs. Lotis Arceo <a href="mailto:lotis.arceo@cit.edu" className='hover:underline'>(lotis.arceo@cit.edu)</a> : Liaison Librarian for Arch, ECE, EM, and ME
                            </p>
                            <p className="py-1"> <BiSolidRightArrow className='inline me-2'/>
                                Ms. Janice Mirasol <a href="mailto:janice.mirasol@cit.edu" className='hover:underline'>(janice.mirasol@cit.edu)</a> : Liaison Librarian for CE, CHE, EE, and IE
                            </p>
                            <p className="py-1"> <BiSolidRightArrow className='inline me-2'/>
                                Ms. Daisy Diane E. Racaza <a href="mailto:daisydiane.racaza@cit.edu" className='hover:underline'>(daisydiane.racaza@cit.edu)</a> : Liaison Librarian for CPE
                            </p>
                            <p className="py-1"> <BiSolidRightArrow className='inline me-2'/>
                                Mrs. Risalina Sumagaysay <a href="mailto:risalina.sumagaysay@cit.edu" className='hover:underline'>(risalina.sumagaysay@cit.edu)</a> : CEA Library Assistant
                            </p>
                            
                        </div>

                        <Popover.Close>
                            <p className="absolute top-0 right-0 me-2 mt-2 text-2xl text-white"><BsX /></p>
                        </Popover.Close>
                    </Popover.Content>
                </Popover.Portal>

            </Popover.Root>
        </div>
    )
}

export default LibraryInfo