import React, { FC } from 'react';
import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import demoFromHTML from './export';
import axios from 'axios';
import 'mdb-ui-kit/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from 'react';

async function sendEmail() {
  await axios.post("/api/subscribe", { email: "dafelcardozo@hotmail.com", text: "Hola Felipe desde local" });
}
type LoginProps = {
  email: string,
  password: string
};

type formProps = {
  onFormSubmit: Function,
}

const LoginForm = (props:formProps) => {
  const {onFormSubmit} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  return <form onSubmit={(event) => {event.preventDefault();
                                onFormSubmit({email, password});}}>
    <div className="form-outline mb-4">
      <input type="email" id="form1Example1" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)}/>
      <label className="form-label" htmlFor="form1Example1">Email address</label>
    </div>
    <div className="form-outline mb-4">
      <input type="password" id="form1Example2" className="form-control" onChange={(event) => setPassword(event.target.value)} />
      <label className="form-label" htmlFor="form1Example2">Password</label>
    </div>
    <div className="row mb-4">
      <div className="col d-flex justify-content-center">
        <div className="form-check">
          <input className="form-check-input" type="checkbox"  id="form1Example3" />
          <label className="form-check-label" htmlFor="form1Example3"> Remember me </label>
        </div>
      </div>
      <div className="col">
        <a href="#!">Forgot password?</a>
      </div>
    </div>
    <button type="submit" className="btn btn-primary btn-block" >Sign in</button>
  </form>
}

function RegistroEmpresarial() {
  return <form >
                  <h1 className="title">
                Regístrese para que le enviemos un montón de correo!
              </h1>
    <h2>Formulario de registro</h2>
    <div className="form-outline mb-4">
      <label htmlFor='empresa' className="form-label" >¿Cómo se llama tu empresa?</label>
      <input type='text' name='empresa' placeholder='Mi empresa' className="form-control"></input>

    </div>
    <div className="form-outline mb-4">
      <label htmlFor='nit' className="form-label" >NIT o Número de Identificación Tributaria</label>
      <input type='text' name='nit' placeholder='12345' className="form-control"></input>

    </div>
    <div className="form-outline mb-4">
      <label htmlFor='direccion' className="form-label">Dirección</label>
      <input type='text' name="direccion" placeholder='Calle 123, Bogota' className="form-control"></input>

    </div>
    <div className="form-outline mb-4">
      <label htmlFor='telefono' className="form-label" >Teléfono</label>
      <input type='text' name='telefono' placeholder='+57 313 413 6320' className="form-control"></input>

    </div>
    <button type="submit" className="btn btn-primary btn-block">Terminar registro</button>
  </form>
}

export async function getServerSideProps(context: any) {
  try {
    await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

function ActionButtons() {
  return <>
  <div >Export PDF button:
    <button onClick={demoFromHTML}>Export PDF button</button>
  </div>
  <div>Send an email:
    <button onClick={sendEmail}>Send email button</button>
  </div>
  </>;
}

function Navbar() {
  return <>
  <header className="mb-10">
  
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-mdb-toggle="collapse"
          data-mdb-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
          aria-label="Toggle navigation">
          <i className="fas fa-bars"></i>
        </button>
  
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <a className="navbar-brand mt-2 mt-lg-0" href="#">
            <img src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp" height="15" alt="MDB Logo"
         />
          </a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#">Empresas</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Mis proyectos</a>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center">
          <a className="text-reset me-3" href="#">
            <i className="fas fa-shopping-cart"></i>
          </a>

          <div className="dropdown">
            <a className="text-reset me-3 dropdown-toggle hidden-arrow" href="#" id="navbarDropdownMenuLink" role="button"
              data-mdb-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-bell"></i>
              <span className="badge rounded-pill badge-notification bg-danger">1</span>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <a className="dropdown-item" href="#">Some news</a>
              </li>
              <li>
                <a className="dropdown-item" href="#">Another news</a>
              </li>
              <li>
                <a className="dropdown-item" href="#">Something else here</a>
              </li>
            </ul>
          </div>
          <div className="dropdown">
            <a className="dropdown-toggle d-flex align-items-center hidden-arrow" href="#" id="navbarDropdownMenuAvatar"
              role="button" data-mdb-toggle="dropdown" aria-expanded="false">
              <img src="mini-retrato.webp" className="rounded-circle" height="25"
                alt="Retrato del desarrollador"  />
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuAvatar">
              <li>
                <a className="dropdown-item" href="#">Mi hoja de vida</a>
              </li>
              <li>
                <a className="dropdown-item" href="#">Settings</a>
              </li>
              <li>
                <a className="dropdown-item" href="#">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    </header>
    </>
}

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [formVisible, setFormVisible] = useState(false);


  return (
    <div>
      <Head>
        <title>Registro empresarial</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar></Navbar>
      
      <section>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 vh-100">
              <LoginForm onFormSubmit={() => setFormVisible(true)} ></LoginForm>
            </div>
            {!formVisible &&
            <div className="col-lg-6 vh-100 bg-primary">
            </div>
            }
            {formVisible &&
            <div className="col-lg-6 vh-100">
                <RegistroEmpresarial></RegistroEmpresarial>
            </div>}
            <main>              
              {false && <ActionButtons></ActionButtons>}
              {isConnected ? (
                <div className="subtitle">You are connected to MongoDB</div>
              ) : (
                <div className="subtitle">
                  You are NOT connected to MongoDB. Check the <code>README.md</code>{' '}
                  for instructions.
                </div>
              )}

            </main>
          </div>
        </div>
      </section>
    </div>
  )
}
