import { ScriptProps } from "next/script";
import { NavBar } from "./NavBar";
import styles from "@/app/styles/AppBody.module.css";
import { Component, ReactNode } from "react";

type AppBodyProps = {
    child: ReactNode;
}

export default function AppBody(props: AppBodyProps) {
    return (
        <div id={styles.AppBody}>
            <div id={styles.NavContainer}>
                <NavBar />
            </div>
            <div id={styles.BodyContainer}>
                { props.child }
            </div>
        </div>
    );
}