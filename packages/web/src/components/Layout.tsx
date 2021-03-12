import styled from "@emotion/styled";

export const Expander = styled.div`
  flex: 1;
`;

export const Main = styled.div`
  flex: 1;
  min-height: 100%;
  display: flex;
  justify-content: center;
  background-color: ${(p) => p.theme.colors.pageBackgroundColor};
`;

export const Body = styled.div`
  flex: 1;
  justify-content: center;
  display: flex;
`;

export const Container = styled.div`
  width: 1000px;
  padding-top: 100px;
`;

export const Flex = styled.div<{
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;

  h?: number | string;
  w?: number | string;

  justify?: "center" | "flex-start" | "flex-end";
  align?: "center" | "flex-start" | "flex-end";

  col?: boolean;
}>((p) => ({
  marginTop: p.mt,
  marginBottom: p.mb,
  marginRight: p.mr,
  marginLeft: p.ml,

  height: p.h,
  width: p.w,

  justifyContent: p.justify,
  alignItems: p.align,

  display: "flex",
  position: "relative",
  flexDirection: p.col ? "column" : "row",
}));
