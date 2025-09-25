import PageHeader from '@/components/PageHeader'
import GetAllLaundryItems from '../_components/GetAllLaundryItems'
import Image from 'next/image'

const page = () => {
  return (
    <div className='p-4'>
        <PageHeader
        title="LAUNDRY ITEMS"
        rightElement={
          <Image
            src={"/logo-text-laundr.png"}
            alt="laundr image"
            width={100}
            height={50}
            className="rounded-full"
          />
        }
      />
        <GetAllLaundryItems />
    </div>
  )
}

export default page
