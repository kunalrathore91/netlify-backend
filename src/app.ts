
import { Router } from 'express'
import userRouter from './routes/userRoute'
import residencyRouter from './routes/residencyRoute'


const app = Router()

app.use('/api/user', userRouter)
app.use('/api/residency', residencyRouter)


export default app