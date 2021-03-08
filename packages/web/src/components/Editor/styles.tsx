import styled from "@emotion/styled";

export const EditorStyled = styled.div`
  width: 100%;
  //background-color: white;
  font-size: 20px;
  line-height: 1.2;

  & .public-DraftEditorPlaceholder-root {
    position: absolute;
    opacity: 0.3;
    pointer-events: none;
  }

  & i {
    font-style: italic;
  }

  & b {
    font-weight: bold;
  }

  & h1 {
    font-size: 35px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  & h2 {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  & h3 {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  & li,
  & ul {
    list-style-type: none;
    margin-left: 40px;
    text-indent: -20px;
    margin-bottom: 20px;

    & + li,
    & + ul {
      margin-top: -20px;
    }
  }

  & .paragraph,
  & p {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;
