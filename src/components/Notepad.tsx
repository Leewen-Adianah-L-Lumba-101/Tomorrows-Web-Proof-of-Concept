import { ReactJSX } from "@emotion/react/dist/declarations/src/jsx-namespace";
import { useEffect } from "react";
import { FaCheck, FaTrashAlt, FaPaintBrush, FaPlus } from 'react-icons/fa';

type StickyObject = {
  value: string;
  color: string;
};

// Create a notepad section for profile page
export default function Notepad(): ReactJSX.Element {
  useEffect(() => {
    loadStartEvents();
  }, []);

  // Make sure that when refreshing the page all the locally stored variables are present
  function loadStartEvents(): void {
    const deleteAllBtn = document.querySelector<HTMLLIElement>("#deleteAll");
    const createFirstSticky =
      document.querySelector<HTMLDivElement>("#createStickyBtn");

    if (!deleteAllBtn || !createFirstSticky) return;

    document.onmouseup = hideDropMenu;
    deleteAllBtn.onclick = deleteAllStickies;
    createFirstSticky.onclick = createId;

    getStoredStickies(createFirstSticky);
  }


  // This is for the dropdown menu with the different colours, its not part of it
  function hideDropMenu(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    const stickies = Array.from(
      document.querySelectorAll<HTMLElement>(".sticky")
    );

    const stickiesIdArray = stickies
      .map((el) => el.id)
      .filter(Boolean);

    stickiesIdArray.forEach((id) => {
      const dropContent = document.querySelector<HTMLElement>(
        `#${id} .dropdown-content-hide`
      );
      const dropButton = document.querySelector<HTMLElement>(
        `#${id} .drop-button`
      );

      if (
        dropContent &&
        dropButton &&
        dropContent !== target.parentNode &&
        dropButton !== target
      ) {
        dropContent.style.display = "none";
      }
    });
  }

  // Delete ALL sticky notes
  function deleteAllStickies(): void {
    localStorage.clear();

    const parent = document.querySelector<HTMLElement>("#main-notepad");
    if (!parent) return;

    while (parent.children.length > 2) {
      parent.removeChild(parent.lastChild as ChildNode);
    }

    const createBtn =
      document.querySelector<HTMLElement>("#createStickyBtn");
    if (createBtn) createBtn.style.display = "block";
  }

  //  Obtain all locally stored sticky data aka the text content
  function getStoredStickies(createFirstSticky: HTMLElement): void {

    const stickiesArray = getStickiesArray();

    // Prevent duplicates from happening (aka stored text content duplicates to the other)
    if (getStickyCount() > 0) return;

    createFirstSticky.style.display = stickiesArray.length > 0 ? "none" : "block";

    stickiesArray.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return;

      const stickyObject: StickyObject = JSON.parse(raw);
      addStoredStickiesToDom(stickyObject, key);
    });
  }
  
  // Set all notes inside an array
  function getStickiesArray(): string[] {
    const stored = localStorage.getItem("stickiesArray");

    if (!stored) {
      const empty: string[] = [];
      localStorage.setItem("stickiesArray", JSON.stringify(empty));
      return empty;
    }

    return JSON.parse(stored);
  }

  // Add stickies into the DOM 
  function addStoredStickiesToDom (
    stickyObject: StickyObject,
    key: string
    ): void { const stickyClone = setIdToStoredObjects(key);
    const textarea = stickyClone.querySelector<HTMLTextAreaElement>(".sticky-content");

    if (textarea) {
      textarea.value = stickyObject.value;
      textarea.onchange = storeSticky;
      textarea.oninput = notSavedNotification;
    }

    stickyClone.style.backgroundImage = stickyObject.color;
  }
  
  // Create a unique ID for sticky notes
  function setIdToStoredObjects(key: string): HTMLElement {
    const stickyClone = createSticky();
    stickyClone.id = key;
    return stickyClone;
  }

  // Adding sticky notes by adding child divs to parent div
  function createSticky(): HTMLElement {
    const parent = document.querySelector<HTMLElement>("#main-notepad")!;
    const sticky = document.querySelector<HTMLElement>(".sticky")!;
    const stickyClone = sticky.cloneNode(true) as HTMLElement;

    parent.appendChild(stickyClone);
    stickyClone.style.display = "block";

    stickyClone
      .querySelector<HTMLElement>(".add-button")
      ?.addEventListener("click", createId);

    stickyClone
      .querySelector<HTMLElement>(".remove-button")
      ?.addEventListener("click", deleteSticky);

    stickyClone
      .querySelector<HTMLElement>(".drop-button")
      ?.addEventListener("click", toggleDropMenuClick);

    stickyClone
      .querySelectorAll<HTMLElement>(".dropdown-content-hide > div")
      .forEach((el) => el.addEventListener("click", changeColor));

    const content =
      stickyClone.querySelector<HTMLTextAreaElement>(".sticky-content");

    if (content) {
      content.value = "";
    }

    return stickyClone;
  }

  // Creating unique ids for Sticky
  function createId(e: Event): void {
    const target = e.target as HTMLElement;

    if (target.id === "createStickyBtn") {
      target.style.display = "none";
    }

    const key = `sticky_${Date.now()}`;
    const stickyClone = createSticky();
    stickyClone.id = key;

    // Rebind the text handler to the sticky note
    const textarea = stickyClone.querySelector<HTMLTextAreaElement>(".sticky-content");

    if (textarea) {
      textarea.onchange = storeSticky;
      textarea.oninput = notSavedNotification;
    }
  }

  // Removing a sticky note by looping through the stored sticky list
  function deleteSticky(e: Event): void {
    const target = e.target as HTMLElement;
    const sticky = target.closest(".sticky") as HTMLElement;
    if (!sticky) return;

    const key = sticky.id;
    localStorage.removeItem(key);

    const stickiesArray = getStickiesArray().filter((id) => id !== key);
    localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));

    sticky.remove();

    const createBtn =document.querySelector<HTMLElement>("#createStickyBtn");

    if (createBtn) {
      createBtn.style.display =
      getStickyCount() === 0 ? "block" : "none";
    }
  }

  // THIS IS NOT USED, BUT IN SHORT ITS FOR THE STICKY BACKGROUND CHANGER
  function toggleDropMenuClick(e: Event): void {
    const target = e.target as HTMLElement;
    const sticky = target.closest(".sticky") as HTMLElement;
    if (!sticky) return;

    const dropMenu =
      sticky.querySelector<HTMLElement>(".dropdown-content-hide");

    if (dropMenu) {
      dropMenu.style.display =
        dropMenu.style.display === "flex" ? "none" : "flex";
    }
  }

  // Change background colour of sticky
  function changeColor(e: Event): void {
    const colorBtn = e.target as HTMLElement;
    const sticky = colorBtn.closest(".sticky") as HTMLElement;
    if (!sticky) return;

    const key = sticky.id;
    const newColor = getComputedStyle(colorBtn).backgroundImage;

    const raw = localStorage.getItem(key);
    if (!raw) return;

    const stickyObject: StickyObject = JSON.parse(raw);
    stickyObject.color = newColor;

    sticky.style.backgroundImage = newColor;
    localStorage.setItem(key, JSON.stringify(stickyObject));
  }

  // Store sticky contents alongside it's unique ID
  function storeSticky(e: Event): void {
    const textarea = e.target as HTMLTextAreaElement;
    const sticky = textarea.closest(".sticky") as HTMLElement;

    const key = sticky.id;
    const stickyObject: StickyObject = {
      value: textarea.value,
      color: getComputedStyle(sticky).backgroundImage
    };

    localStorage.setItem(key, JSON.stringify(stickyObject));

    const stickiesArray = getStickiesArray();
    if (!stickiesArray.includes(key)) {
      stickiesArray.push(key);
      localStorage.setItem("stickiesArray", JSON.stringify(stickiesArray));
    }
  }

  function notSavedNotification(e: Event): void {
    const textarea = e.target as HTMLTextAreaElement;
    const sticky = textarea.closest(".sticky") as HTMLElement;

    const notSaved =
      sticky.querySelector<HTMLElement>(".notSaved");

    if (notSaved) {
      notSaved.style.display = "inline-block";
      notSaved.style.color = "red";
      notSaved.title = "not saved";
    }
  }

  function getStickyCount(): number {
   return document.querySelectorAll(".sticky[id]").length;
  }

  return (
    <div>
      <header id="header-notepad">
        <nav id="navbar-notepad">
          <ul>
            <li id="deleteAll">Delete all</li>
          </ul>
        </nav>
      </header>

      <main id="main-notepad">
        <div className="sticky" style={{ display: "none" }}>
          <div className="sticky-header">
            <span className="add-button fas fa-plus"><FaPlus/></span>
            <span className="notSaved fas fa-check"><FaCheck/></span>

            <div className="dropdown-content-hide">
              <div className="pink-color" />
              <div className="yellow-color" />
              <div className="green-color" />
              <div className="blue-color" />
              <div className="purple-color" />
            </div>
            <span className="remove-button fas fa-trash-alt"><FaTrashAlt/></span>
          </div>

          <textarea className="sticky-content" />
        </div>
        <div id="createStickyBtn">+</div>
      </main>
    </div>
  );
}
