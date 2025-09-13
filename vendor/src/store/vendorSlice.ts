import { createSlice } from '@reduxjs/toolkit'

type VendorState = {
  name: string
  logoUrl?: string
}

const initialState: VendorState = {
  name: 'Käriz Vendor',
  logoUrl: undefined,
}

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {},
})

export default vendorSlice.reducer
