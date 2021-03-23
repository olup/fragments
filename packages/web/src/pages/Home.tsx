import { Fragment } from "components/Fragment";
import { Flex } from "components/Layout";
import { NewFragment } from "components/NewFragment";
import { useEngine } from "contexts/engine";

export const Home = () => {
  const fragment = useEngine((s) => s.actions.getRandomFragment());
  return (
    <div>
      <Flex style={{ marginBottom: 20 }}>
        <NewFragment placeholder="New fragment" />
      </Flex>
      {fragment && (
        <>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            A Random Thought
          </div>
          <Flex style={{ marginBottom: 20 }} key={fragment.handle}>
            <Fragment
              fragment={fragment}
              // onDelete={(uuid) => uuid && onDelete(uuid)}
              saveOnBlur
            />
          </Flex>
        </>
      )}
    </div>
  );
};
