import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useRef } from 'react';
import { Asset } from 'expo-asset';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { copyAsync, documentDirectory } from 'expo-file-system';

const query =
    "SELECT FORMULA.*, INGREDIENTPRODUCT.ProductId AS PRODUCT_ProductId, TSYSTEM.TSystemId AS TSYSTEM_TSystemId, TSYSTEM.TSystemDesc AS TSYSTEM_TSystemDesc, BASEDERIVEDINGREDIENT.IngredientCoefRel AS DERIVED_Coef, BASEDERIVEDINGREDIENT.Coef1 AS DERIVED_Coef1, BASEDERIVEDINGREDIENT.IngredientId AS DERIVED_Id FROM FORMULA INNER JOIN TSYSTEM ON TSYSTEM.TSystemID IN ( CASE WHEN ( FORMULA.IngredientId0 IS NULL OR FORMULA.IngredientId0 IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) AND ( FORMULA.IngredientId1 IS NULL OR FORMULA.IngredientId1 IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) AND ( FORMULA.IngredientId2 IS NULL OR FORMULA.IngredientId2 IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) AND ( FORMULA.IngredientId3 IS NULL OR FORMULA.IngredientId3 IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) AND ( FORMULA.IngredientId4 IS NULL OR FORMULA.IngredientId4 IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) AND ( FORMULA.IngredientId5 IS NULL OR FORMULA.IngredientId5 IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) AND ( FORMULA.IngredientId6 IS NULL OR FORMULA.IngredientId6 IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) AND ( FORMULA.IngredientId7 IS NULL OR FORMULA.IngredientId7 IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) AND ( FORMULA.IngredientId8 IS NULL OR FORMULA.IngredientId8 IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) AND ( FORMULA.IngredientId9 IS NULL OR FORMULA.IngredientId9 IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) AND ( BASEDERIVEDINGREDIENT.IngredientId IS NULL OR BASEDERIVEDINGREDIENT.IngredientId IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID = 1 ) ) THEN 1 END ) INNER JOIN INGREDIENT BASEINGREDIENT ON BASEINGREDIENT.IngredientId IN ( FORMULA.IngredientId0, FORMULA.IngredientId1, FORMULA.IngredientId2, FORMULA.IngredientId3, FORMULA.IngredientId4, FORMULA.IngredientId5, FORMULA.IngredientId6, FORMULA.IngredientId7, FORMULA.IngredientId8, FORMULA.IngredientId9 ) AND BASEINGREDIENT.IngredientType IN (1, 2, 3) INNER JOIN ( SELECT 0 AS IS_DERIVED UNION ALL SELECT 1 AS IS_DERIVED ) DERIVEDFORMULA LEFT JOIN INGREDIENT BASEDERIVEDINGREDIENT ON IS_DERIVED = 1 AND BASEINGREDIENT.IngredientId = BASEDERIVEDINGREDIENT.IngredientIdRel AND BASEDERIVEDINGREDIENT.IngredientId IN ( SELECT TSYSTEMINGREDIENT.IngredientId FROM TSYSTEMINGREDIENT WHERE TSYSTEMINGREDIENT.TSystemID IN (1) ) INNER JOIN INGREDIENTPRODUCT ON ( INGREDIENTPRODUCT.IngredientId = BASEINGREDIENT.IngredientId AND IS_DERIVED = 0 ) OR ( INGREDIENTPRODUCT.IngredientId = BASEDERIVEDINGREDIENT.IngredientId AND IS_DERIVED = 1 ) LEFT JOIN POS ON ( SGroupIdAssigned IS NULL OR SGroupIdAssigned = POS.SPosGroupId ) WHERE FormulaStatus = 'E' AND ( IS_DERIVED = 0 OR BASEDERIVEDINGREDIENT.IngredientId IS NOT NULL ) AND ( PosIdAssigned IS NULL OR PosIdAssigned = ? ) AND ( SGroupIdAssigned = NULL OR POS.PosId = ? ) AND TSYSTEM.TSystemID = ? AND INGREDIENTPRODUCT.ProductId = ? ORDER BY FormulaCode ASC LIMIT ?, ?";

const args = [101, 101, 1, 19];

export default function App() {
    const database = useRef<SQLiteDatabase | null>(null);

    const executeQuery = async () => {
        if (!database.current) {
            const [{ localUri }] = await Asset.loadAsync(require('./assets/database.db'));

            if (!localUri) {
                throw new Error('Failed to load database');
            }

            await copyAsync({ from: localUri, to: documentDirectory + 'SQLite/' + 'database.db' });
            if (localUri) {
                database.current = await openDatabaseAsync('database.db');
            } else {
                throw new Error('Failed to load database');
            }
        }

        const result = await database.current.getAllAsync(query, [...args, 0, 42]);
        console.log(result);
    };

    return (
        <View style={styles.container}>
            <Button onPress={executeQuery} title={'Execute query'} />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
