    "use client";
    import styled from "styled-components";

    export const SidebarWrapper = styled.div<{ open: boolean }>`
        background-color: var(--background);
        transition: transform 0.2s ease
        height: 100%;
        height: 100%;
        position:fixed;
        transform: translateX(-100%);
        width: 16rem;
        flex-shrink: 0;
        z-index: 202;
        overflow-y: auto;
        border-right: 1px solid var(--border);
        flex-direction: column;
        padding-top: var(--spacing-10);
        padding-bottom: var(--spacing-10);
        padding-left: var(--spacing-6);
        padding-right: var(--spacing-6);

        ::-webkit-scrollbar {
            display: none;
        }

        @media (min-width: 768px) {
            margin-left: 0;
            display: flex;
            position: static;
            height: 100vh;
            transform: translateX(0);
        }

        ${(props: any) =>
        props.collapsed &&
        `  
        display: inherit;
        margin-left: 0;
        transform: translateX(0);
        `}
        `;

    export const Overlay = styled.div<{ open: boolean }>`
    background-color: rgba(15, 23, 42, 0.3);
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 999;
    transition: opacity 0.3s ease;
    opacity: 0.8;

    @media (min-width: 768px) {
        display: none;
        z-index: auto;
        opacity: 1;
    }  
    `;

    export const Header = styled.header`
    display: flex;
    gap: var(--spacing-8);
    align-items: center;
    padding-left: var(--spacing-10);
    padding-right: var(--spacing-10  );
    `;

    export const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-8);
    margin-top: var(--spacing-13);
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
    `;

    export const Footer = styled.footer`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-8);
    padding-top: var(--spacing-18);
    padding-bottom: var(--spacing-8);
    padding-left: var(--spacing-8);
    padding-right: var(--spacing-8);

    @media (min-width: 768px) {
        padding-top: 0;
        padding-bottom: 0;
    }
    `;

    export const Sidebar = {
    Wrapper: SidebarWrapper,
    Overlay,
    Header,
    Body,
    Footer,
};
