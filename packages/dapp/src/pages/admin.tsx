import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('../components/custom/VAdmin'), {
  ssr: false
})

export default () => <DynamicComponentWithNoSSR />

